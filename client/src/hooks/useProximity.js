import { useEffect, useRef } from 'react';
import { CONFIG } from '../constants/config';
import { getDistance } from '../utils/proximity';
import useCosmosStore from '../store/cosmosStore';

export function useProximity(emitProximityEnter, emitProximityLeave) {
  const intervalRef = useRef(null);
  const nearbyRef = useRef(new Set());

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      const { localUser, remoteUsers } = useCosmosStore.getState();
      if (!localUser) return;

      const currentNearby = new Set();

      for (const [userId, remote] of Object.entries(remoteUsers)) {
        const dist = getDistance(localUser.x, localUser.y, remote.x, remote.y);

        if (dist < CONFIG.PROXIMITY_RADIUS) {
          currentNearby.add(userId);

          // Newly entered proximity
          if (!nearbyRef.current.has(userId)) {
            emitProximityEnter(userId);
          }
        }
      }

      // Check who left proximity
      for (const userId of nearbyRef.current) {
        if (!currentNearby.has(userId)) {
          emitProximityLeave(userId);
        }
      }

      nearbyRef.current = currentNearby;
    }, CONFIG.PROXIMITY_CHECK_MS);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [emitProximityEnter, emitProximityLeave]);

  return nearbyRef;
}
