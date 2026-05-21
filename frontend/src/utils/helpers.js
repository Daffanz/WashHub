/**
 * Format number to Indonesian Rupiah.
 */
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount);
};

/**
 * Format number with thousand separator.
 */
export const formatNumber = (num) => {
  return new Intl.NumberFormat('id-ID').format(num);
};

/**
 * Get initials from name.
 */
export const getInitials = (name) => {
  if (!name) return '';
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

/**
 * Truncate text.
 */
export const truncateText = (text, maxLength = 50) => {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

/**
 * Debounce function.
 */
export const debounce = (func, wait = 300) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

/**
 * Get role display color classes.
 */
export const getRoleColor = (roleName) => {
  const colors = {
    'Super Admin': 'bg-red-500/20 text-red-400',
    'Franchise Manager': 'bg-amber-500/20 text-amber-400',
    'Outlet Staff': 'bg-emerald-500/20 text-emerald-400',
  };
  return colors[roleName] || 'bg-gray-500/20 text-gray-400';
};
