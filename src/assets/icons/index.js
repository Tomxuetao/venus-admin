const svgFiles = import.meta.glob('./svg/*.svg');

export default {
  getNameList() {
    return Object.keys(svgFiles).map((item) =>
      item.replace('./svg/', '').replace('.svg', ''),
    );
  },
};
