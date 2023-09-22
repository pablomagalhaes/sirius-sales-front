import React from 'react'

const ToastAlertIcon = (): JSX.Element => {
  return (
    <div style={{ marginRight: '15px' }}>
        <svg
            width="30"
            height="30"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <circle id="alert-clicked" cx="9" cy="9" r="9" fill="white"/>
            <path
                d="M8.25474 10.4487L8.07652 4.35107H9.82051L9.62956 10.4487H8.25474ZM8.98034 13.3511C8.67482 13.3511 8.42447 13.2577 8.22928 13.071C8.04257 12.8843 7.94922 12.6594 7.94922 12.3963C7.94922 12.1248 8.04257 11.8956 8.22928 11.7089C8.42447 11.5222 8.67482 11.4289 8.98034 11.4289C9.26888 11.4289 9.5065 11.5222 9.69321 11.7089C9.8884 11.8956 9.98599 12.1248 9.98599 12.3963C9.98599 12.6594 9.8884 12.8843 9.69321 13.071C9.5065 13.2577 9.26888 13.3511 8.98034 13.3511Z"
                fill="#FF4D4D"
            />
        </svg>
    </div>
  )
}

export default ToastAlertIcon
