import { closeWs, openWs } from './ws';

export const onLogin = () => openWs();
export const onLogout = () => closeWs();
