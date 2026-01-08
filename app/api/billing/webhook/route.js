import { NextResponse } from "next/server";
import { headers } from "next/headers";
import Stripe from "stripe";
import connectMongo from "@/libs/mongoose";
import User from "@/models/User";

export async function POST(req) {
  try {
    // 1. Verify the webhook event is from Stripe
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

    const body = await req.text();
    const signature = (await headers()).get("stripe-signature");
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    let event;
    try {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        webhookSecret
      );
    } catch (err) {
      console.error(`Webhook signature verification failed: ${err.message}`);
      return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
    }

    const { data, type } = event;

    console.log(`Received Stripe webhook event: ${type}`);

    if (type === "checkout.session.completed") {
      // ✅ Grant access to the product

      await connectMongo();

      const clientReferenceId = data.object.client_reference_id;
      const customerId = data.object.customer;

      console.log(`Processing checkout.session.completed. ClientRefID: ${clientReferenceId}, CustomerID: ${customerId}`);

      if (!clientReferenceId) {
        console.error("Missing client_reference_id in webhook payload");
        return NextResponse.json({ received: true }); // Still return 200 to acknowledge
      }

      const user = await User.findById(clientReferenceId);

      if (user) {
        user.hasAccess = true;
        user.customerId = customerId;

        // Ensure planId is also set if available in metadata or line items (optional but good practice)
        // For now just focusing on customerId

        await user.save();
        console.log(`Successfully updated user ${clientReferenceId}: hasAccess=true, customerId=${customerId}`);
      } else {
        console.error(`User not found for client_reference_id: ${clientReferenceId}`);
      }

    } else if (type === "customer.subscription.deleted") {
      // ❌ Revoke access to the product (subscription cancelled or non-payment)

      await connectMongo();

      const user = await User.findOne({
        customerId: data.object.customer,
      });

      if (user) {
        user.hasAccess = false;
        await user.save();
        console.log(`Revoked access for user with customerId: ${data.object.customer}`);
      } else {
        console.warn(`User not found to revoke access for customerId: ${data.object.customer}`);
      }
    }

    return NextResponse.json({ received: true });

  } catch (e) {
    console.error("Stripe webhook handler error: " + e?.message);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 400 }
    );
  }
}