import { Button, Popconfirm } from 'antd';
import type { ButtonProps } from 'antd';
import type { ReactNode } from 'react';

type Props = {
  title?: ReactNode;
  okText?: string;
  cancelText?: string;
  onConfirm: () => void | Promise<void>;
  children: ReactNode;
} & Omit<ButtonProps, 'onClick' | 'children'>;

export function ConfirmButton({ title = '确定执行这个操作吗？', okText = '确认', cancelText = '取消', onConfirm, children, danger, ...rest }: Props) {
  return (
    <Popconfirm title={title} okText={okText} cancelText={cancelText} okButtonProps={{ danger }} onConfirm={onConfirm}>
      <Button danger={danger} {...rest}>{children}</Button>
    </Popconfirm>
  );
}
