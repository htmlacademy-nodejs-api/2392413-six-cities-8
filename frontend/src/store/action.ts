import { createAsyncThunk } from '@reduxjs/toolkit';
import type { AxiosError, AxiosInstance } from 'axios';
import type { History } from 'history';
import {
  adaptCommentsToClient,
  adaptCommentToClient,
  adaptOfferDetailToClient,
  adaptOffersToClient,
} from '../adapters/adapters-to-client';
import { adaptSignupToServer } from '../adapters/adapters-to-server';
import { ApiRoute, AppRoute, HttpCode } from '../const';
import { OfferListRdo } from '../dto/offer/offer-list-rdo';
import { OfferRdo } from '../dto/offer/offer-rdo';
import { ReviewRdo } from '../dto/review/review-rdo';
import { RegisteredUserRdo } from '../dto/user/registered-user-rdo';
import { UserRdo } from '../dto/user/user-rdo';
import type {
  Comment,
  CommentAuth,
  FavoriteAuth,
  NewOffer,
  Offer,
  UserAuth,
  UserRegister,
} from '../types/types';
import { Token } from '../utils';

type Extra = {
  api: AxiosInstance;
  history: History;
};

export const Action = {
  FETCH_OFFERS: 'offers/fetch',
  FETCH_OFFER: 'offer/fetch',
  POST_OFFER: 'offer/post-offer',
  EDIT_OFFER: 'offer/edit-offer',
  DELETE_OFFER: 'offer/delete-offer',
  FETCH_FAVORITE_OFFERS: 'offers/fetch-favorite',
  FETCH_PREMIUM_OFFERS: 'offers/fetch-premium',
  FETCH_COMMENTS: 'offer/fetch-comments',
  POST_COMMENT: 'offer/post-comment',
  POST_FAVORITE: 'offer/post-favorite',
  DELETE_FAVORITE: 'offer/delete-favorite',
  LOGIN_USER: 'user/login',
  LOGOUT_USER: 'user/logout',
  FETCH_USER_STATUS: 'user/fetch-status',
  REGISTER_USER: 'user/register',
};

export const fetchOffers = createAsyncThunk<
  Offer[],
  undefined,
  { extra: Extra }
>(Action.FETCH_OFFERS, async (_, { extra }) => {
  const { api } = extra;
  const { data } = await api.get<OfferListRdo[]>(ApiRoute.Offers);

  return adaptOffersToClient(data);
});

export const fetchFavoriteOffers = createAsyncThunk<
  Offer[],
  undefined,
  { extra: Extra }
>(Action.FETCH_FAVORITE_OFFERS, async (_, { extra }) => {
  const { api } = extra;
  const { data } = await api.get<OfferListRdo[]>(ApiRoute.Favorite);

  return adaptOffersToClient(data);
});

export const fetchOffer = createAsyncThunk<
  Offer,
  Offer['id'],
  { extra: Extra }
>(Action.FETCH_OFFER, async (id, { extra }) => {
  const { api, history } = extra;

  try {
    const { data } = await api.get<OfferRdo>(`${ApiRoute.Offers}/${id}`);

    return adaptOfferDetailToClient(data);
  } catch (error) {
    const axiosError = error as AxiosError;

    if (axiosError.response?.status === HttpCode.NOT_FOUND) {
      history.push(AppRoute.NotFound);
    }

    return Promise.reject(error);
  }
});

export const postOffer = createAsyncThunk<Offer, NewOffer, { extra: Extra }>(
  Action.POST_OFFER,
  async (newOffer, { extra }) => {
    const { api, history } = extra;
    const { data } = await api.post<OfferRdo>(ApiRoute.Offers, newOffer);
    history.push(`${AppRoute.Property}/${data.id}`);

    return adaptOfferDetailToClient(data);
  }
);

export const editOffer = createAsyncThunk<Offer, Offer, { extra: Extra }>(
  Action.EDIT_OFFER,
  async (offer, { extra }) => {
    const { api, history } = extra;
    const { data } = await api.patch<OfferRdo>(
      `${ApiRoute.Offers}/${offer.id}`,
      offer
    );
    history.push(`${AppRoute.Property}/${data.id}`);

    return adaptOfferDetailToClient(data);
  }
);

export const deleteOffer = createAsyncThunk<void, string, { extra: Extra }>(
  Action.DELETE_OFFER,
  async (id, { extra }) => {
    const { api, history } = extra;
    await api.delete(`${ApiRoute.Offers}/${id}`);
    history.push(AppRoute.Root);
  }
);

export const fetchPremiumOffers = createAsyncThunk<
  Offer[],
  string,
  { extra: Extra }
>(Action.FETCH_PREMIUM_OFFERS, async (cityName, { extra }) => {
  const { api } = extra;
  const { data } = await api.get<OfferListRdo[]>(
    `${ApiRoute.Premium}/${cityName}`
  );

  return adaptOffersToClient(data);
});

export const fetchComments = createAsyncThunk<
  Comment[],
  Offer['id'],
  { extra: Extra }
>(Action.FETCH_COMMENTS, async (id, { extra }) => {
  const { api } = extra;
  const { data } = await api.get<ReviewRdo[]>(
    `${ApiRoute.Offers}/${id}${ApiRoute.Comments}`
  );

  return adaptCommentsToClient(data);
});

export const fetchUserStatus = createAsyncThunk<
  UserAuth['email'],
  undefined,
  { extra: Extra }
>(Action.FETCH_USER_STATUS, async (_, { extra }) => {
  const { api } = extra;

  try {
    const { data } = await api.get<UserRdo>(ApiRoute.Login);

    return data.email;
  } catch (error) {
    const axiosError = error as AxiosError;

    if (axiosError.response?.status === HttpCode.UNAUTHORIZED) {
      Token.drop();
    }

    return Promise.reject(error);
  }
});

export const loginUser = createAsyncThunk<
  UserAuth['email'],
  UserAuth,
  { extra: Extra }
>(Action.LOGIN_USER, async ({ email, password }, { extra }) => {
  const { api, history } = extra;
  const { data } = await api.post<UserRdo & { token: string }>(ApiRoute.Login, {
    email,
    password,
  });
  const { token } = data;

  Token.save(token);
  history.push(AppRoute.Root);

  return email;
});

export const logoutUser = createAsyncThunk<void, undefined, { extra: Extra }>(
  Action.LOGOUT_USER,
  async (_, { extra }) => {
    const { api } = extra;
    await api.delete(ApiRoute.Logout);

    Token.drop();
  }
);

export const registerUser = createAsyncThunk<
  void,
  UserRegister,
  { extra: Extra }
>(
  Action.REGISTER_USER,
  async ({ email, password, name, avatar, type }, { extra }) => {
    const { api, history } = extra;
    const body = adaptSignupToServer({
      email,
      password,
      name,
      type,
    });
    const { data } = await api.post<RegisteredUserRdo>(ApiRoute.Register, body);
    if (avatar) {
      const payload = new FormData();
      payload.append('avatar', avatar);
      await api.post(`users/${data.id}${ApiRoute.Avatar}`, payload, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    }
    history.push(AppRoute.Login);
  }
);

export const postComment = createAsyncThunk<
  Comment,
  CommentAuth,
  { extra: Extra }
>(Action.POST_COMMENT, async ({ id, comment, rating }, { extra }) => {
  const { api } = extra;
  const { data } = await api.post<ReviewRdo>(
    `${ApiRoute.Offers}/${id}${ApiRoute.Comments}`,
    { comment, rating }
  );

  return adaptCommentToClient(data);
});

export const postFavorite = createAsyncThunk<
  Offer,
  FavoriteAuth,
  { extra: Extra }
>(Action.POST_FAVORITE, async (id, { extra }) => {
  const { api, history } = extra;

  try {
    const { data } = await api.post<OfferRdo>(`${ApiRoute.Favorite}/${id}`);

    return adaptOfferDetailToClient(data);
  } catch (error) {
    const axiosError = error as AxiosError;

    if (axiosError.response?.status === HttpCode.UNAUTHORIZED) {
      history.push(AppRoute.Login);
    }

    return Promise.reject(error);
  }
});

export const deleteFavorite = createAsyncThunk<
  Offer,
  FavoriteAuth,
  { extra: Extra }
>(Action.DELETE_FAVORITE, async (id, { extra }) => {
  const { api, history } = extra;

  try {
    const { data } = await api.delete<OfferRdo>(`${ApiRoute.Favorite}/${id}`);

    return adaptOfferDetailToClient(data);
  } catch (error) {
    const axiosError = error as AxiosError;

    if (axiosError.response?.status === HttpCode.UNAUTHORIZED) {
      history.push(AppRoute.Login);
    }

    return Promise.reject(error);
  }
});
