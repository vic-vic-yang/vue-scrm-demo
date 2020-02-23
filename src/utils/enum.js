// translate router.meta.title, be used in breadcrumb sidebar tagsview
export function value2Label(enumData, value) {
  const keys = Object.keys(enumData);
  for (const key in keys) {
    const item = enumData[key];
    if (item.value + '' === value + '') {
      return item.label;
    }
  }
  return '';
}
