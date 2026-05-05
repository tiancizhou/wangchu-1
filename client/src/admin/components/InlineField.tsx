import { Input, InputNumber, Switch, Select, Form } from 'antd';
import type { ReactNode } from 'react';

type BaseProps = {
  label?: string;
  placeholder?: string;
  status?: '' | 'error' | 'warning';
  message?: string;
};

type TextProps = BaseProps & { type: 'text'; value: string; onChange: (value: string) => void };
type NumberProps = BaseProps & { type: 'number'; value: number; onChange: (value: number) => void; min?: number; max?: number };
type SwitchProps = BaseProps & { type: 'switch'; value: boolean; onChange: (value: boolean) => void };
type SelectProps = BaseProps & { type: 'select'; value: string; onChange: (value: string) => void; options: { label: string; value: string }[] };

export type InlineFieldProps = TextProps | NumberProps | SwitchProps | SelectProps;

export function InlineField(props: InlineFieldProps) {
  const { label, status, message } = props;

  let control: ReactNode;
  if (props.type === 'text') {
    control = <Input value={props.value} placeholder={props.placeholder} onChange={(e) => props.onChange(e.target.value)} status={status || undefined} />;
  } else if (props.type === 'number') {
    control = <InputNumber style={{ width: '100%' }} value={props.value} min={props.min} max={props.max} onChange={(value) => props.onChange(Number(value ?? 0))} status={status || undefined} />;
  } else if (props.type === 'switch') {
    control = <Switch checked={props.value} onChange={props.onChange} />;
  } else {
    control = <Select value={props.value} options={props.options} onChange={props.onChange} style={{ width: '100%' }} status={status || undefined} />;
  }

  if (!label && !message) return <>{control}</>;

  return (
    <Form.Item label={label} validateStatus={status || undefined} help={message} style={{ marginBottom: 0 }}>
      {control}
    </Form.Item>
  );
}
