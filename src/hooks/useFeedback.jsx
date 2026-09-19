import { App } from 'antd'
import {
  CheckCircleFilled,
  CloseCircleFilled,
  ExclamationCircleFilled,
  InfoCircleFilled,
} from '@ant-design/icons'

/**
 * One place for the two feedback patterns used across the app:
 *  - toasts (success/error) after any create/update/delete API call
 *  - a "are you sure?" modal before destructive or state-changing actions
 *    (delete, logout, status changes)
 *
 * Must be called from a component rendered under <AntApp> (see App.jsx) so
 * the static-style antd APIs pick up the theme and render in the right place.
 */
export function useFeedback() {
  const { notification, modal } = App.useApp()

  const toastSuccess = (title, description) => {
    notification.success({
      title,
      description,
      placement: 'topRight',
      duration: 3.5,
      icon: <CheckCircleFilled style={{ color: '#1f9d55' }} />,
    })
  }

  /** Pass an ApiError (or any Error) — its `.message` is used as the description. */
  const toastError = (err, fallbackMessage = 'Something went wrong') => {
    const description = typeof err === 'string' ? err : err?.message || fallbackMessage
    notification.error({
      title: 'Error',
      description,
      placement: 'topRight',
      duration: 5,
      icon: <CloseCircleFilled style={{ color: '#e0435c' }} />,
    })
  }

  /** Standard toast fired when a form is submitted while it still has validation errors. */
  const toastValidationError = (description = 'Please fix the highlighted fields and try again.') => {
    notification.error({
      title: 'Check the form',
      description,
      placement: 'topRight',
      duration: 4,
      icon: <CloseCircleFilled style={{ color: '#e0435c' }} />,
    })
  }

  const toastInfo = (title, description) => {
    notification.info({
      title,
      description,
      placement: 'topRight',
      duration: 3.5,
      icon: <InfoCircleFilled style={{ color: '#2b8fd6' }} />,
    })
  }

  /**
   * Shows a confirm modal before running `onConfirm`. `onConfirm` may be async;
   * the modal's OK button shows a loading spinner until it resolves, and stays
   * open on rejection so the user can see what happened (pair with toastError
   * inside the handler).
   */
  const confirmAction = ({ title, description, okText = 'Confirm', danger = false, onConfirm }) => {
    modal.confirm({
      title,
      content: description,
      okText,
      cancelText: 'Cancel',
      centered: true,
      icon: <ExclamationCircleFilled style={{ color: danger ? '#e0435c' : '#f2a12b' }} />,
      okButtonProps: { danger },
      onOk: onConfirm,
    })
  }

  return { toastSuccess, toastError, toastInfo, toastValidationError, confirmAction }
}
