import { CollectionUpdateEvent } from "../CollectionUpdateEvent";

type Item = {
  key: string;
  value: number;
};

describe("CollectionUpdateEvent", () => {
  it('should create an event with type "update"', () => {
    const event = new CollectionUpdateEvent<"key", string, Item>([
      { key: "a", value: 1 },
    ]);
    expect(event.type).toBe("update");
  });

  it("should attach items in detail", () => {
    const items = [
      { key: "a", value: 1 },
      { key: "b", value: 2 },
    ];
    const event = new CollectionUpdateEvent(items);
    expect(event.detail).toEqual(items);
  });

  it("should set immediatePropagationStopped to false by default", () => {
    const event = new CollectionUpdateEvent([]);
    expect(event.immediatePropagationStopped).toBe(false);
  });

  it("should set immediatePropagationStopped to true after stopImmediatePropagation()", () => {
    const event = new CollectionUpdateEvent([]);
    event.stopImmediatePropagation();
    expect(event.immediatePropagationStopped).toBe(true);
  });

  it("should call native stopImmediatePropagation()", () => {
    const event = new CollectionUpdateEvent([]);
    const spy = vi.spyOn(CustomEvent.prototype, "stopImmediatePropagation");

    event.stopImmediatePropagation();

    expect(spy).toHaveBeenCalled();
    spy.mockRestore(); // восстанавливаем оригинальный метод после теста
  });
});
