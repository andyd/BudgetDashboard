// Tailwind class utilities for responsive design in comparison builder components

export const containerClasses = {
  wrapper: "w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8",
  section: "py-4 sm:py-6 lg:py-8",
  card: "p-4 sm:p-6 rounded-lg bg-white shadow-sm",
} as const;

export const selectorClasses = {
  wrapper: "flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6",
  item: "w-full sm:w-auto sm:flex-1",
  label: "block text-sm font-medium text-gray-700 mb-1 sm:mb-2",
  select:
    "w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
  button:
    "w-full sm:w-auto px-4 py-2 text-sm sm:text-base font-medium rounded-md",
} as const;

export const resultClasses = {
  container: "mt-4 sm:mt-6",
  heading: "text-lg sm:text-xl lg:text-2xl font-semibold text-gray-900",
  subheading: "text-sm sm:text-base text-gray-600",
  value: "text-xl sm:text-2xl lg:text-3xl font-bold",
  label: "text-xs sm:text-sm text-gray-500",
  grid: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6",
  card: "p-3 sm:p-4 rounded-lg bg-gray-50",
} as const;

export const alternativesPanelClasses = {
  container: "mt-6 sm:mt-8",
  grid: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6",
  column: "flex flex-col gap-3 sm:gap-4",
  header:
    "text-base sm:text-lg font-medium text-gray-900 pb-2 border-b border-gray-200",
  item: "p-3 sm:p-4 rounded-md bg-white border border-gray-200 hover:border-blue-300 transition-colors",
  itemTitle: "text-sm sm:text-base font-medium text-gray-900",
  itemDescription: "text-xs sm:text-sm text-gray-600 mt-1",
  itemValue: "text-sm sm:text-base font-semibold text-blue-600 mt-2",
} as const;

export const modalClasses = {
  overlay:
    "fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center",
  container:
    "w-full h-[90vh] sm:h-auto sm:max-h-[85vh] sm:w-full sm:max-w-lg md:max-w-2xl lg:max-w-4xl bg-white rounded-t-xl sm:rounded-xl overflow-hidden flex flex-col",
  header:
    "flex items-center justify-between p-4 sm:p-6 border-b border-gray-200",
  headerTitle: "text-lg sm:text-xl font-semibold text-gray-900",
  closeButton: "p-2 -m-2 text-gray-400 hover:text-gray-600 transition-colors",
  body: "flex-1 overflow-y-auto p-4 sm:p-6",
  footer:
    "flex flex-col-reverse sm:flex-row gap-2 sm:gap-4 p-4 sm:p-6 border-t border-gray-200",
  footerButton:
    "w-full sm:w-auto px-4 py-2.5 sm:py-2 text-sm sm:text-base font-medium rounded-md",
  footerButtonPrimary: "bg-blue-600 text-white hover:bg-blue-700",
  footerButtonSecondary: "bg-gray-100 text-gray-700 hover:bg-gray-200",
} as const;
