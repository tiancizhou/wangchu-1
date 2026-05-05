import { useState, Children, isValidElement, cloneElement, type ReactElement, type ReactNode } from 'react';
import { Space } from 'antd';

type Mode = 'accordion' | 'free';

type SectionCardLike = ReactElement<{ collapsed?: boolean; onCollapsedChange?: (collapsed: boolean) => void; defaultCollapsed?: boolean }>;

type Props = {
  mode?: Mode;
  defaultExpandedIndex?: number;
  children: ReactNode;
};

export function SectionCardGroup({ mode = 'accordion', defaultExpandedIndex = 0, children }: Props) {
  const [expanded, setExpanded] = useState<number>(defaultExpandedIndex);
  const items = Children.toArray(children).filter(isValidElement) as SectionCardLike[];

  return (
    <Space direction="vertical" size={12} style={{ width: '100%' }}>
      {items.map((child, index) => {
        if (mode === 'free') return child;
        return cloneElement(child, {
          collapsed: expanded !== index,
          onCollapsedChange: (collapsed: boolean) => {
            setExpanded((current) => {
              if (collapsed) return current === index ? -1 : current;
              return index;
            });
          }
        });
      })}
    </Space>
  );
}
