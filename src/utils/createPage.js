export const createPage = (content) => {
  const element = document.createElement("div");

  element.innerHTML = content;
  return element;
};
