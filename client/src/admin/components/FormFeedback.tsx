import { App } from 'antd';
import { useCallback, useMemo, useState } from 'react';

export function useFormFeedback() {
  const { message } = App.useApp();
  const [dirty, setDirtyState] = useState(false);

  const notifySuccess = useCallback((text: string) => { message.success(text); }, [message]);
  const notifyError = useCallback((text: string) => { message.error(text); }, [message]);
  const setDirty = useCallback((flag: boolean) => setDirtyState(flag), []);

  const renderStatusBar = useCallback(() => {
    return (
      <span style={{ fontSize: 12, color: dirty ? '#f59e0b' : '#22c55e' }}>
        {dirty ? '有未保存的修改' : '当前内容已保存'}
      </span>
    );
  }, [dirty]);

  return useMemo(() => ({ notifySuccess, notifyError, setDirty, dirty, renderStatusBar }), [notifySuccess, notifyError, setDirty, dirty, renderStatusBar]);
}
