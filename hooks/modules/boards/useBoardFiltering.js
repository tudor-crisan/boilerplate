import { useMemo,useState } from "react";

export const sortOptions = [
  { label: "Top Voted", value: "votes_desc" },
  { label: "Newest", value: "date_desc" },
  { label: "Oldest", value: "date_asc" },
  { label: "Most Comments", value: "comments_desc" },
];

const useBoardFiltering = (posts = [], externalState = null) => {
  const [internalSearch, setInternalSearch] = useState("");
  const [internalSort, setInternalSort] = useState("votes_desc");

  const search = externalState?.search ?? internalSearch;
  const sort = externalState?.sort ?? internalSort;
  const setSearch = externalState?.setSearch ?? setInternalSearch;
  const setSort = externalState?.setSort ?? setInternalSort;

  const filteredPosts = useMemo(() => {
    if (!posts) return [];

    return [...posts]
      .filter(post => {
        if (!search) return true;
        const term = search.toLowerCase();
        return (
          post.title?.toLowerCase().includes(term) ||
          post.description?.toLowerCase().includes(term)
        );
      })
      .sort((a, b) => {
        switch (sort) {
          case "votes_desc":
            return (b.votesCounter || 0) - (a.votesCounter || 0);
          case "date_desc":
            return new Date(b.createdAt) - new Date(a.createdAt);
          case "date_asc":
            return new Date(a.createdAt) - new Date(b.createdAt);
          case "comments_desc":
            return (b.commentsCount || 0) - (a.commentsCount || 0);
          default:
            return 0;
        }
      });
  }, [posts, search, sort]);

  return {
    search,
    setSearch,
    sort,
    setSort,
    filteredPosts,
    sortOptions
  };
};

export default useBoardFiltering;
