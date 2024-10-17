import { UserRdo } from '../user/user-rdo';

export class ReviewRdo {
  public id!: string;
  public date!: string;
  public user!: UserRdo;
  public comment!: string;
  public rating!: number;
}
