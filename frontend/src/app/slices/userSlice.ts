import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { parseError } from '@utils/errorUtils';
import { showCustomToast } from '@utils/customToastUtils';
import UserDto from '@dtos/UserDto';
import { getUser, updateUser } from '@api/userService.ts';
import { RootState } from '@app/store.ts';

interface UserState {
    user: UserDto | null;
    loading: boolean;
    error: string | null;
}

const initialState: UserState = {
    user: null,
    loading: false,
    error: null,
};

export const fetchUserProfile = createAsyncThunk<
    UserDto,
    number,
    { rejectValue: string }
>('user/fetchProfile', async (id: number, { rejectWithValue }) => {
    try {
        return await getUser(id);
    } catch (e: unknown) {
        const { status, errorMessage } = parseError(e);
        showCustomToast(errorMessage, 'error', status.toString());
        return rejectWithValue(errorMessage);
    }
});

export const updateUserProfile = createAsyncThunk<
    UserDto,
    { updatedUserData: Partial<UserDto> },
    { rejectValue: string }
>('user/update', async ({ updatedUserData }, { getState, rejectWithValue }) => {
    try {
        const state = getState() as RootState;
        const userId = state.user?.user?.id;
        if (!userId) {
            throw new Error('Не удалось получить id пользователя');
        }

        return await updateUser(userId, updatedUserData);
    } catch (e: unknown) {
        const { status, errorMessage } = parseError(e);
        showCustomToast(errorMessage, 'error', status.toString());
        return rejectWithValue(errorMessage);
    }
});

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        clearUser(state) {
            state.user = null;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchUserProfile.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(
                fetchUserProfile.fulfilled,
                (state, action: PayloadAction<UserDto>) => {
                    state.loading = false;
                    state.user = action.payload;
                },
            )
            .addCase(fetchUserProfile.rejected, (state, action) => {
                state.loading = false;
                state.error =
                    action.payload ?? 'Ошибка при загрузке пользователя';
            });

        builder
            .addCase(updateUserProfile.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(
                updateUserProfile.fulfilled,
                (state, action: PayloadAction<UserDto>) => {
                    state.loading = false;
                    state.user = { ...state.user, ...action.payload }; // Обновление существующего пользователя
                },
            )
            .addCase(updateUserProfile.rejected, (state, action) => {
                state.loading = false;
                state.error =
                    action.payload ?? 'Ошибка при обновлении пользователя';
            });
    },
});

export const { clearUser } = userSlice.actions;
export default userSlice.reducer;
