export const paginationRange = (value: any) => {
  const totalPageCount = Math.ceil(value.total / value.pageSize);
  return rangeInArray(1, totalPageCount);
};

export const rangeInArray = (start: number, end: number) => {
  const length = end - start + 1;
  return Array.from({ length }, (_, index) => index + start);
};
