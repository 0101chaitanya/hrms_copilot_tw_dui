import { useDispatch, useSelector } from 'react-redux';
import api from '../utils/api';
import {
  fetchLeavesStart,
  fetchLeavesSuccess,
  fetchLeavesFailure,
} from '../slices/leaveSlice';

export const useLeaves = () => {
  const dispatch = useDispatch();
  const leaves = useSelector((state) => state.leave.leaves);
  const loading = useSelector((state) => state.leave.loading);
  const error = useSelector((state) => state.leave.error);

  const getLeaves = async () => {
    dispatch(fetchLeavesStart());
    try {
      const response = await api.get('/leaves');
      dispatch(fetchLeavesSuccess(response.data.data));
    } catch (err) {
      dispatch(fetchLeavesFailure(err.response?.data?.message || 'Failed to fetch leaves'));
    }
  };

  return { leaves, loading, error, getLeaves };
};
