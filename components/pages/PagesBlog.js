"use client";
import SectionHeader from "@/components/section/SectionHeader";
import WrapperStyling from "@/components/wrapper/WrapperStyling";
import Main from "@/components/common/Main";

// Using Main and SectionHeader to wrap blog content. 
// Note: PagesHome iterates over sections from config. 
// For PagesBlog, we explicitly want the header and then the children (blog list or article).
// But standard Pages components in this project seem to strictly be "lists of sections".
// The user request says "make a PagesBlog.js also". 
// Given the blog pages already exist (app/blog/page.js), this component likely serves as a wrapper 
// or replacement for the Layout structure, OR literally just renders the Header + Content.
// app/blog/page.js is currently rendering the content.
// app/blog/layout.js was rendering HeaderBlog.

export default function PagesBlog({ children }) {
  // We can just render SectionHeader and children here
  return (
    <WrapperStyling>
      <Main className="bg-base-100">
        <SectionHeader />
        {children}
      </Main>
    </WrapperStyling>
  );
}
