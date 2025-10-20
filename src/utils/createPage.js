export const createPage = (content) => {
  const element = document.createElement("div");
  // if (className) el.className = className;
  element.innerHTML = content;
  return element;
};
