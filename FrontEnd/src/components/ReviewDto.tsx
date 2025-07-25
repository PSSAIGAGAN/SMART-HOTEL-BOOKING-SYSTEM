export interface ReviewDto {
    reviewId?: number;
    userId: number;
    hotelId: number;
    rating: number;
    comment: string;
    timestamp?: string;
    managerReply?: string;
  }
   