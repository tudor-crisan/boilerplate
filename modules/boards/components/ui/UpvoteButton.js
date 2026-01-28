"use client";
import ButtonVote from "@/components/button/ButtonVote";
import { useStyling } from "@/context/ContextStyling";
import useApiRequest from "@/hooks/useApiRequest";
import useLocalStorage from "@/hooks/useLocalStorage";
import { clientApi } from "@/libs/api";
import { useEffect, useState } from "react";

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
      },
    );
  };

  return (
    <ButtonVote
      hasVoted={hasVoted}
      count={votesCounter}
      className={`${styling.components.element} text-lg`}
      onClick={handleVote}
      isLoading={loading}
    />
  );
};

export default BoardUpvoteButton;
