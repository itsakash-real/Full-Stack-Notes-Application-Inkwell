const createRules = {
  title: {
    required: "Title is required",
    type: "string",
    maxLength: "Title cannot exceed 150 characters",
  },
  content: {
    required: "Content is required",
    type: "string",
    maxLength: "Content cannot exceed 100,000 characters",
  },
  tags: {
    type: "array",
    maxItems: "Maximum 10 tags per note",
  },
};

const updateRules = {
  title: {
    type: "string",
    maxLength: "Title cannot exceed 150 characters",
  },
  content: {
    type: "string",
    maxLength: "Content cannot exceed 100,000 characters",
  },
  tags: {
    type: "array",
    maxItems: "Maximum 10 tags per note",
  },
};

const searchRules = {
  q: {
    required: "Search query is required (?q=keyword)",
    type: "string",
    minLength: "Search query must not be empty",
  },
};

module.exports = { createRules, updateRules, searchRules };
