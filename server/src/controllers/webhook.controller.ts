import { RequestHandler } from "express"
import { IncomingHttpHeaders } from "http";
import { Webhook, WebhookRequiredHeaders } from "svix";

import User from '@models/user.model';
import Post from '@models/post.model';
import Comment from '@models/comment.model'

type TUserCreatedEventData = {
    id: string;
    username: string;
    email_addresses: { email_address: string }[];
    profile_image_url: string
};

type TEventType =
    | "user.created"
    | "user.updated"
    | "user.deleted";

type TEvent = {
    data: TUserCreatedEventData;
    type: TEventType;
};


export const clerkWebHook: RequestHandler = async (req, res) => {

    const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

    if (!WEBHOOK_SECRET) {
        throw new Error("Webhook Secret Is Missing ")
    }

    const payload = req.body;
    const headers = req.headers;

    const wh = new Webhook(WEBHOOK_SECRET);
    let event: TEvent | null = null;

    try {
        event = wh.verify(payload, headers as IncomingHttpHeaders & WebhookRequiredHeaders) as TEvent;
    } catch (err) {
        return res.status(400).json({ message: "Webhook verification failed" });
    }

    const TeventType: TEventType = event?.type!;
    

    //listening events
    if (TeventType === "user.created") {

        const { username, id, email_addresses, profile_image_url: img } = event?.data ?? {};

        const email = email_addresses[0].email_address;
      
            const newUser = new User({
                clerkUserId: id,
                username: username || email,
                email,
                img
            });

            await newUser.save();

    }

    if (TeventType === "user.updated") {

        const { username, id, profile_image_url: img } = event?.data ?? {};

        const updatedProfile = {
            username,
            img
        }

        await User.findOneAndUpdate(
            { clerkUserId: id },
            { $set: updatedProfile } // only updating neccessary fields
        )

    }

    if (TeventType === "user.deleted") {

        const { id } = event?.data ?? {};

        const deletedUser = await User.findOneAndDelete({ clerkUserId: id });

        if (deletedUser) {
            const userId = deletedUser._id;

            await Promise.all([
                Post.deleteMany({ user: userId }),
                Comment.deleteMany({ user: userId })
            ])
        }
    }

    return res.status(200).json({
        message: "Webhook received"
    })
}