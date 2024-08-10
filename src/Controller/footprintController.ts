import { Request, Response } from 'express';
import { InputEmptyError, InvalidInputError, NoTokenError } from '../Errors/errors.js';
import { nativeReactions } from '../Application/Features/Footprint/Reaction/Types/reactions.js';
import { footprintReactionHandler } from '../Application/Features/Footprint/Reaction/reactionHandler.js';

export const footprintController = {
  emotion: async (req: Request, res: Response): Promise<void> => {
    if (req.decodedToken === undefined) {
      throw new NoTokenError();
    }
    const { id: userId } = req.decodedToken;

    const { footprintId } = req.body;
    if (!footprintId) {
      throw new InputEmptyError();
    }

    const reaction = req.body.reaction;
    if (reaction !== "empty" && nativeReactions.includes(reaction) === false) {
      throw new InvalidInputError("Reaction is not valid");
    }

    const response = await footprintReactionHandler.handle({
      userId,
      footprintId,
      reaction
    });
    res.status(200).json(response);
  },
};
