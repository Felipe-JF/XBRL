type Element = {
  tag: string;
  children?: readonly Element[];
};

function Element<T extends Element["tag"], E extends Element & { tag: T }>(
  tag: T,
  element: Omit<E, "tag">
): E {
  return <E>{
    ...element,
    tag,
  };
}

function generateXmlElement(element: Element): string {
  if (!element.children || !element.children.length) {
    return `<${element.tag}></${element.tag}>`;
  }

  return `<${element.tag}>
  ${element.children.map(generateXmlElement)}
</${element.tag}>`;
}

function validate(element: Element, tags: readonly string[]) {
  const isValid = validTags.some((validTag) => validTag === element.tag);

  if (!isValid) {
    console.log(
      "Tag " +
        element.tag +
        " in " +
        generateXmlElement(element) +
        " does not exists"
    );
    return false;
  }

  if (!element.children || !element.children.length) {
    return true;
  }

  const childrenInvalid = element.children?.some(
    (element) => !validate(element, tags)
  );
  return !childrenInvalid;
}

const element = Element("hello", {
  children: [
    Element("Alo", {
      children: [
        Element("hello", {
          children: [Element("Alo", { children: [] })],
        }),
      ],
    }),
  ],
});

const validTags = ["hello", "alo"] as const;

const isValid = validate(element, validTags);

const xml = generateXmlElement(element);

console.log(xml);
