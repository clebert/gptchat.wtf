import {joinClassNames} from '../utils/join-class-names.js';
import {
  AdjustmentsHorizontalIcon,
  ArrowRightOnRectangleIcon,
  ArrowUturnLeftIcon,
  ChatBubbleLeftEllipsisIcon,
  ComputerDesktopIcon,
  EyeIcon,
  EyeSlashIcon,
  KeyIcon,
  MoonIcon,
  PaperAirplaneIcon,
  PlusIcon,
  SunIcon,
  TrashIcon,
  UserIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import * as React from 'react';

export interface IconProps {
  type: keyof typeof pathByType;
  standalone?: boolean;
}

const iconHeightWidth = `h-4 w-4`;

const pathByType = {
  adjustmentsHorizontal: <AdjustmentsHorizontalIcon className={iconHeightWidth} />,
  arrowRightOnRectangle: <ArrowRightOnRectangleIcon className={iconHeightWidth} />,
  arrowUturnLeft: <ArrowUturnLeftIcon className={iconHeightWidth} />,
  chatBubbleLeftEllipsis: <ChatBubbleLeftEllipsisIcon className={iconHeightWidth} />,
  computerDesktop: <ComputerDesktopIcon className={iconHeightWidth} />,
  eye: <EyeIcon className={iconHeightWidth} />,
  eyeSlash: <EyeSlashIcon className={iconHeightWidth} />,
  key: <KeyIcon className={iconHeightWidth} />,
  moon: <MoonIcon className={iconHeightWidth} />,
  paperAirplane: <PaperAirplaneIcon className={iconHeightWidth} />,
  plus: <PlusIcon className={iconHeightWidth} />,
  sun: <SunIcon className={iconHeightWidth} />,
  trash: <TrashIcon className={iconHeightWidth} />,
  user: <UserIcon className={iconHeightWidth} />,
  xMark: <XMarkIcon className={iconHeightWidth} />,
} as const;

export function Icon({type, standalone}: IconProps): JSX.Element {
  return (
    <div className={joinClassNames(`inline-flex h-5 align-middle`, !standalone && `mr-1`)}>
      {pathByType[type]}
    </div>
  );
}
