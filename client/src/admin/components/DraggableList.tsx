import { DndContext, PointerSensor, closestCenter, useSensor, useSensors } from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core';
import { SortableContext, useSortable, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import type { SortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { HolderOutlined } from '@ant-design/icons';
import type { CSSProperties, ReactNode } from 'react';

export type DragHandleProps = {
  ref: (node: HTMLElement | null) => void;
  listeners: Record<string, any> | undefined;
  attributes: Record<string, any>;
};

type Props<T> = {
  items: T[];
  getItemId: (item: T) => string;
  onReorder: (items: T[]) => void;
  renderItem: (item: T, index: number, dragHandle: DragHandleProps) => ReactNode;
  containerStyle?: CSSProperties;
  rowStyle?: CSSProperties;
  strategy?: SortingStrategy;
};

function Row<T>({ item, index, id, renderItem, rowStyle }: { item: T; index: number; id: string; renderItem: Props<T>['renderItem']; rowStyle?: CSSProperties }) {
  const { setNodeRef, transform, transition, isDragging, setActivatorNodeRef, attributes, listeners } = useSortable({ id });

  const style: CSSProperties = {
    ...rowStyle,
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1
  };

  return (
    <div ref={setNodeRef} style={style}>
      {renderItem(item, index, { ref: setActivatorNodeRef, listeners, attributes })}
    </div>
  );
}

export function DraggableList<T>({ items, getItemId, onReorder, renderItem, containerStyle, rowStyle, strategy = verticalListSortingStrategy }: Props<T>) {
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 4 } }));

  function onDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = items.findIndex((item) => getItemId(item) === active.id);
    const newIndex = items.findIndex((item) => getItemId(item) === over.id);
    if (oldIndex < 0 || newIndex < 0) return;
    onReorder(arrayMove(items, oldIndex, newIndex));
  }

  const ids = items.map((item) => getItemId(item));

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
      <SortableContext items={ids} strategy={strategy}>
        <div style={containerStyle || { display: 'flex', flexDirection: 'column', gap: 8 }}>
          {items.map((item, index) => (
            <Row key={getItemId(item)} item={item} index={index} id={getItemId(item)} renderItem={renderItem} rowStyle={rowStyle} />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}

export function DragHandle({ dragHandle }: { dragHandle: DragHandleProps }) {
  return (
    <span ref={dragHandle.ref} {...dragHandle.attributes} {...dragHandle.listeners} style={{ cursor: 'grab', color: '#94a3b8', display: 'inline-flex', alignItems: 'center', padding: 4 }}>
      <HolderOutlined />
    </span>
  );
}
