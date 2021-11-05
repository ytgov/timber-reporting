const dateOptions = {
  year: 'numeric',
  month: 'short',
  day: '2-digit',
} as const;

const monthOptions = {
  year: 'numeric',
  month: 'short',
} as const;

export const formatDateFromISO = (isoDateTime: string) => {
  if (!isoDateTime) {
    return '';
  }

  const date = new Date(isoDateTime);
  return new Intl.DateTimeFormat('en-US', dateOptions).format(date);
};

export const formatDate = (date?: Date) => {
  if (!date) {
    return '';
  }

  return new Intl.DateTimeFormat('en-US', dateOptions).format(date);
};

export const formatMonth = (date?: Date) => {
  if (!date) {
    return '';
  }

  return new Intl.DateTimeFormat('en-US', monthOptions).format(date);
};
