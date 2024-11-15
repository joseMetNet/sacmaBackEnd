
import { CreateAllWorkTrackingDTO } from './work-tracking.schema';
// ...existing code...

router.post('/create-all', (req, res) => {
  const result = CreateAllWorkTrackingDTO.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json(result.error);
  }
  // ...handle valid data...
});