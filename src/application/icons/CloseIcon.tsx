import React from 'react'

const CloseIcon = (props: { onClick: () => void }): JSX.Element => {
  return (
    <svg
      onClick={props.onClick}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="#222222"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>Close Icon</title>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M2.97817 2.76466C3.28875 2.45865 3.7886 2.46235 4.09462 2.77293L21.0329 19.964C21.3389 20.2746 21.3352 20.7744 21.0246 21.0805C20.714 21.3865 20.2142 21.3828 19.9081 21.0722L2.9699 3.88112C2.66388 3.57053 2.66758 3.07068 2.97817 2.76466Z"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M20.9774 2.76466C20.6668 2.45865 20.167 2.46235 19.8609 2.77293L2.92269 19.964C2.61667 20.2746 2.62037 20.7744 2.93096 21.0805C3.24154 21.3865 3.74139 21.3828 4.04741 21.0722L20.9857 3.88112C21.2917 3.57053 21.288 3.07068 20.9774 2.76466Z"
      />
    </svg>
  )
}

export default CloseIcon
