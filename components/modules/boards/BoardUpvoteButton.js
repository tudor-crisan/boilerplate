"use client";
import { useState, useEffect } from "react";
import { clientApi } from "@/libs/api";
import Button from "@/components/button/Button";
import SvgVote from "@/components/svg/SvgVote";
import useApiRequest from "@/hooks/useApiRequest";
import { useStyling } from "@/context/ContextStyling";
import useLocalStorage from "@/hooks/useLocalStorage";

const BoardUpvoteButton = ({ postId, initialVotesCounter, onVote }) => {
  const { styling } = useStyling();
  const localStorageKeyName = `${process.env.NEXT_PUBLIC_APP}-hasVoted-${postId}`;

  const [hasVoted, setHasVoted] = useLocalStorage(localStorageKeyName, false);
  const [votesCounter, setVotesCounter] = useState(initialVotesCounter);

  useEffect(() => {
    setVotesCounter(initialVotesCounter);
  }, [initialVotesCounter]);

  const { request, loading } = useApiRequest();

  const handleVote = async (e) => {
    e.stopPropagation();

    if (loading) return;

    // Snapshot for revert
    const wasVoted = hasVoted;
    const previousVotes = votesCounter;

    // Optimistic Update
    if (wasVoted) {
      const newVal = votesCounter - 1;
      setHasVoted(false);
      setVotesCounter(newVal);
      if (onVote) onVote(newVal);
    } else {
      const newVal = votesCounter + 1;
      setHasVoted(true);
      setVotesCounter(newVal);
      if (onVote) onVote(newVal);
    }

    await request(
      () => {
        return wasVoted
          ? clientApi.delete(`/api/modules/boards/vote?postId=${postId}`)
          : clientApi.post(`/api/modules/boards/vote?postId=${postId}`, {});
      },
      {
        onError: () => {
          // Revert state on error (hook handles local storage revert)
          setHasVoted(wasVoted);
          setVotesCounter(previousVotes);
          if (onVote) onVote(previousVotes);
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
