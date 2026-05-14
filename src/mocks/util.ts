export const paginate = (data: unknown[], page: number, size: number) => {
  const start = (page - 1) * size;
  return {
    items: data.slice(start, start + size),
    totalCount: data.length,
    totalPages: Math.ceil(data.length / size),
    currentPage: page,
  };
};
