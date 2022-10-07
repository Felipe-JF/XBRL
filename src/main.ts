type Element = {
  tag: string;
  id?: string;
  data?: Element["id"];
  children?: readonly Element[];
};

type Node = {
  meta: {
    type: string;
  };
  children: readonly Node[];
};

function Element<E extends Element>(element: E): E {
  return element;
}

function generateXmlElement(element: Element): string {
  if (!element.children || !element.children.length) {
    return `<${element.tag}></${element.tag}>`;
  }

  return `<${element.tag}>
  ${element.children.map(generateXmlElement)}
</${element.tag}>`;
}

function collectIds(
  element: Element,
  references: Map<Element["id"], Element>
): Map<Element["id"], Element> {
  if (element.id) {
    references.set(element.id, element);
  }

  if (element.children) {
    const map = element.children.reduce(
      (state, children) => collectIds(children, state),
      references
    );

    return map;
  }

  return references;
}

function validateReferences(
  element: Element,
  ids: Map<Element["id"], Element>
): Map<Element["id"], Element> {
  if (element.data) {
    const reference = ids.get(element.data);
    if (!reference) {
      throw new Error(
        "Reference " +
          element.data +
          " in element " +
          generateXmlElement(element) +
          " does not exists"
      );
    }
    return ids;
  }

  if (element.children) {
    const map = element.children.reduce(
      (state, children) => validateReferences(children, state),
      references
    );

    return map;
  }

  return ids;
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

const element: Element = {
  tag: "hello",
  children: [
    {
      tag: "hello",
      id: "salarios",
      children: [
        {
          tag: "hello",
          id: "sub referencia importante",
          children: [
            {
              tag: "hello",
              id: "sub referencia importante",
              children: [],
            },
          ],
        },
      ],
    },
    {
      tag: "hell",
      data: "salariosasdas",
      children: [],
    },
  ],
};

const validTags = ["hello", "alo"] as const;

const isValid = validate(element, validTags);

const references = collectIds(element, new Map());

console.log({ references });

validateReferences(element, references);

const xml = generateXmlElement(element);

console.log(xml);
