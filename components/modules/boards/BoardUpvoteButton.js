"use client";

import { useState } from "react";
import axios from "axios";
import Button from "@/components/button/Button";
import SvgVote from "@/components/svg/SvgVote";
import useApiRequest from "@/hooks/useApiRequest";
import { useStyling } from "@/context/ContextStyling";
import useLocalStorage from "@/hooks/useLocalStorage";

const BoardUpvoteButton = ({ postId, initialVotesCounter }) => {
  const { styling } = useStyling();
  const localStorageKeyName = `${process.env.NEXT_PUBLIC_APP}-hasVoted-${postId}`;

  const [hasVoted, setHasVoted] = useLocalStorage(localStorageKeyName, false);
  const [votesCounter, setVotesCounter] = useState(initialVotesCounter);

  const { request, loading } = useApiRequest();

  const handleVote = async (e) => {
    e.stopPropagation();

    if (loading) return;

    // Snapshot for revert
    const wasVoted = hasVoted;
    const previousVotes = votesCounter;

    // Optimistic Update
    if (wasVoted) {
      setHasVoted(false);
      setVotesCounter((prev) => prev - 1);
    } else {
      setHasVoted(true);
      setVotesCounter((prev) => prev + 1);
    }

    await request(
      () => {
        return wasVoted
          ? axios.delete(`/api/modules/boards/vote?postId=${postId}`)
          : axios.post(`/api/modules/boards/vote?postId=${postId}`);
      },
      {
        onError: () => {
          // Revert state on error (hook handles local storage revert)
          setHasVoted(wasVoted);
          setVotesCounter(previousVotes);
        },
      }
    );
  };

  return (
    <Button
      variant={hasVoted ? "btn-primary" : "btn-ghost"}
      className={`${styling.roundness[0]}! group text-lg gap-2 ${hasVoted
        ? "border-transparent"
        : "bg-base-100 text-base-content border-base-200 hover:border-base-content/25"
        }`}
      onClick={handleVote}
      isLoading={loading}
      startIcon={<SvgVote />}
    >
      <span className="text-sm font-medium">
        {votesCounter}
      </span>
    </Button>
  );
};

export default BoardUpvoteButton;
