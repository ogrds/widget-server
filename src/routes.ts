// Dependencies
import express from "express";

// Services
import { SubmitFeedbackService } from "./services/SubmitFeedbackService";

// Repositories / Adapters
import { NodemailerMailAdapter } from "./adapters/nodemailer/NodemailerMailAdapter";
import { PrismaFeedbacksRepository } from "./repositories/prisma/PrismaFeedbacksRepository";

export const routes = express.Router();

routes.post("/feedbacks", async (req, res) => {
  const { type, comment, screenshot } = req.body;

  const prismaFeedbacksRepository = new PrismaFeedbacksRepository();
  const nodemailerMailAdapter = new NodemailerMailAdapter();

  const submitFeedbackService = new SubmitFeedbackService(
    prismaFeedbacksRepository,
    nodemailerMailAdapter
  );

  try {
    await submitFeedbackService.execute({ type, comment, screenshot });
    return res.status(201).send();
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
});
