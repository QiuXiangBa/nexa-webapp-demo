export interface TelemetryPayload {
  action: string;
  status: 'success' | 'failed';
  scene: string;
  detail?: string;
}

export const trackAction = (payload: TelemetryPayload): void => {
  const line = {
    ts: new Date().toISOString(),
    action: payload.action,
    status: payload.status,
    scene: payload.scene,
    detail: payload.detail || ''
  };
  console.info('[nexa-track]', JSON.stringify(line));
};
