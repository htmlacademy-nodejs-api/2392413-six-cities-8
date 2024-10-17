export default class CreateReviewDto {
  public offerId!: string;
  public date!: Date;
  public userId!: string;
  public comment!: string;
  public rating!: number;
}
