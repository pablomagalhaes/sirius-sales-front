import React from 'react'

interface TruckIconProps {
  defaultColor: string
}

const TruckIcon = ({ defaultColor }: TruckIconProps): JSX.Element => {
  return (
    <svg width="18" height="19" viewBox="0 0 18 19" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M6.60596 13.9978C6.38447 13.9978 6.20518 13.8185 6.20166 13.6006V13.5373C6.20518 13.3158 6.38447 13.14 6.60596 13.14H11.2677C11.3696 13.14 11.4646 13.1787 11.5349 13.2525C11.6052 13.3228 11.6474 13.4213 11.6474 13.5197C11.6474 13.5302 11.6474 13.5408 11.6474 13.5549V13.5724V13.5865C11.6474 13.597 11.6474 13.6076 11.6474 13.6217C11.6474 13.7236 11.6087 13.8185 11.5349 13.8888C11.4646 13.9592 11.3661 14.0013 11.2677 14.0013H6.60596V13.9978Z" fill={defaultColor} />
      <path d="M3.99023 9.52639C3.76875 9.52639 3.58945 9.34709 3.58594 9.12913V9.06584C3.58945 8.84436 3.76875 8.66858 3.99023 8.66858H8.65195C8.75391 8.66858 8.84883 8.70725 8.91914 8.78108C8.98945 8.85139 9.03164 8.94983 9.03164 9.04827C9.03164 9.05881 9.03164 9.06936 9.03164 9.07991V9.09748V9.11155C9.03164 9.12209 9.03164 9.13264 9.03164 9.14319C9.03164 9.24514 8.99297 9.34006 8.91914 9.41037C8.84883 9.48069 8.75039 9.52288 8.65195 9.52288H3.99023V9.52639Z" fill={defaultColor} />
      <path d="M4.10625 15.3654C3.99375 15.3654 3.88125 15.3514 3.76875 15.3232C3.13594 15.158 2.72461 14.7502 2.53828 14.1104C2.52773 14.0787 2.51719 14.0471 2.50664 14.0154H2.38008C2.29219 14.0154 2.20781 14.0154 2.11992 14.0154C2.03555 14.0154 1.94766 14.0154 1.86328 14.0154C1.73672 14.0154 1.63125 14.0154 1.53633 14.0225C1.52578 14.0225 1.51523 14.0225 1.50469 14.0225C1.34648 14.0225 1.21992 13.9768 1.12852 13.8854C1.03359 13.7904 0.987891 13.6498 0.987891 13.4811C0.994922 13.0732 0.994922 12.6549 0.991406 12.2928H0.984375V12.1521C0.984375 11.4314 0.984375 10.0076 0.984375 9.2834V7.53262C0.984375 6.69238 0.984375 5.84863 0.984375 5.0084C0.984375 4.87129 0.994922 4.70957 1.08633 4.55137C1.25859 4.24551 1.5293 4.09082 1.89141 4.09082C2.93203 4.09082 3.97617 4.09082 5.0168 4.09082H8.75039C9.49922 4.09082 10.2832 4.09082 11.032 4.09082C11.243 4.09082 11.4117 4.13652 11.5629 4.23848C11.7914 4.38965 11.9004 4.60762 11.9039 4.93105C11.9074 5.13145 11.9074 5.34238 11.9074 5.5252L11.8723 5.52871H11.9074C11.9074 5.63418 11.9074 5.73965 11.9074 5.84512C11.9074 5.86621 11.9109 5.8873 11.9109 5.91543C11.9109 5.92598 11.9109 5.92598 11.9109 6.23535V6.27051C11.9109 6.43574 11.9074 6.63262 11.9074 6.77324H12.0797H12.8355C13.1344 6.77324 13.4859 6.77324 13.8516 6.76973H13.8586C14.0555 6.76973 14.2066 6.84355 14.3332 7.00527C14.7305 7.51152 15.0539 8.0916 15.3211 8.77363C15.3879 8.94238 15.4512 9.11816 15.5145 9.2834C15.5391 9.34668 15.5602 9.40996 15.5848 9.47324L15.7781 9.54355C15.9609 9.61035 16.1437 9.67363 16.3266 9.74043C16.7168 9.88457 16.9383 10.1482 16.984 10.5279L16.9875 10.549C17.0016 10.6615 17.0156 10.774 17.0156 10.89C17.0191 11.5545 17.0191 12.2506 17.0156 12.9607C17.0156 13.0627 17.0051 13.1682 16.984 13.2877C16.9031 13.7553 16.5973 14.0225 16.1402 14.0225C16.1262 14.0225 16.1121 14.0225 16.098 14.0225C16.0172 14.0189 15.9293 14.0189 15.8273 14.0189C15.7359 14.0189 15.6445 14.0189 15.5531 14.0225H15.4266C15.409 14.0225 15.3844 14.026 15.3633 14.0295C15.2332 14.6553 14.8395 15.0912 14.2312 15.2916C14.0766 15.3443 13.9184 15.3689 13.7637 15.3689C13.3102 15.3689 12.8812 15.151 12.5613 14.7537C12.1816 14.2826 12.0937 13.7623 12.2977 13.2068C12.4348 12.8307 12.6914 12.5389 13.0535 12.3314C13.2926 12.1979 13.5316 12.1275 13.7672 12.1275C13.8023 12.1275 13.841 12.1275 13.8762 12.1311C14.3613 12.1768 14.7516 12.3912 15.0363 12.7709C15.1102 12.8693 15.1734 12.9783 15.2367 13.0803C15.2543 13.1119 15.2719 13.14 15.2895 13.1682C15.402 13.1787 15.532 13.1857 15.6762 13.1857C15.8836 13.1857 16.0664 13.1752 16.1824 13.1576C16.1859 13.126 16.1859 13.0908 16.1859 13.0592V13.0521C16.1859 12.349 16.1859 11.551 16.1859 10.7775C16.1859 10.5807 16.1754 10.5701 15.9785 10.4998C15.873 10.4611 15.7641 10.4225 15.6586 10.3873C15.5039 10.3311 15.3281 10.2678 15.1594 10.2115C14.9906 10.1553 14.8816 10.0393 14.8254 9.85996C14.7656 9.66309 14.6883 9.42754 14.6074 9.19902C14.4281 8.71035 14.2102 8.15137 13.8727 7.68379C13.848 7.67324 13.6863 7.60996 12.8215 7.60996C12.4031 7.60996 12.0305 7.62402 11.925 7.63105V12.2787C11.925 12.4826 11.7598 12.6514 11.5559 12.6549H11.5418C11.3133 12.6549 11.127 12.4686 11.1234 12.24C11.1234 12.0924 11.1234 11.108 11.1234 10.1834V10.1377C11.1234 10.1377 11.1234 9.59629 11.1234 9.3748C11.1234 9.34668 11.1234 9.31504 11.1234 9.28691C11.1234 9.23418 11.1234 9.18145 11.1234 9.13223C11.1234 9.11816 11.1234 9.1041 11.1234 9.09004V9.08301V8.95996C11.1234 8.80527 11.1234 8.64707 11.1234 8.49238V8.48535C11.1234 8.07754 11.1234 7.65918 11.1199 7.24434C11.1199 7.21621 11.1199 7.18809 11.127 7.15293V6.07715C11.127 6.00684 11.127 5.93301 11.127 5.8627V5.83809C11.127 5.65879 11.1305 5.47598 11.1234 5.29668C11.1199 5.20176 11.1094 5.0998 11.0988 4.99785L11.0953 4.95918C11.0566 4.95566 11.018 4.95215 10.9863 4.95215C9.47461 4.95215 7.89258 4.95215 6.38086 4.95215H1.98633H1.92656C1.90547 4.95215 1.88086 4.95215 1.85977 4.95566C1.85625 4.95566 1.85273 4.95566 1.85273 4.95566C1.85273 4.95918 1.85273 4.95918 1.85273 4.9627C1.84922 4.99434 1.84922 5.02598 1.84922 5.06113V6.6502C1.84922 8.25332 1.84922 10.5596 1.84922 12.1627C1.84922 12.1697 1.84219 12.9643 1.85273 13.1787H2.60156C2.62266 13.14 2.64023 13.1049 2.65781 13.0697C2.88633 12.6338 3.24492 12.335 3.72656 12.1908C3.84609 12.1557 3.96562 12.1346 4.08164 12.1346C4.14492 12.1346 4.2082 12.1416 4.27148 12.1521C4.81641 12.2471 5.22773 12.5354 5.49492 13.01C5.68477 13.3475 5.74102 13.6955 5.66719 14.04C5.57578 14.4689 5.34727 14.8135 4.99219 15.0701C4.70391 15.26 4.40508 15.3654 4.10625 15.3654ZM13.8234 12.9045C13.3559 12.9045 12.9762 13.2842 12.9762 13.7518C12.9762 14.2193 13.3559 14.599 13.8234 14.599C14.291 14.599 14.6707 14.2193 14.6707 13.7518C14.6707 13.2842 14.291 12.9045 13.8234 12.9045ZM4.0957 12.9045C3.62812 12.9045 3.24844 13.2842 3.24844 13.7518C3.24844 14.2193 3.62812 14.599 4.0957 14.599C4.56328 14.599 4.94297 14.2193 4.94297 13.7518C4.94297 13.2842 4.56328 12.9045 4.0957 12.9045Z" fill={defaultColor} />
    </svg>
  )
}

export default TruckIcon
