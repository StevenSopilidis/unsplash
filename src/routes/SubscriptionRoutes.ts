import { Router } from "express";
import { stripe } from "../index";
import { Require_Auth } from "../middleware/Require_Auth";
import { User, SubscriptionTier, getTierValue, getTierPrice } from "../models/User";
import { Request, Response } from "express";
import { UnauthorizedError } from "../errors/UnauthorizedError";
import { BadRequestError } from "../errors/BadRequestError";
import { Stripe } from "stripe";

const router = Router();

router.post("/api/create-checkout-session",
Require_Auth,
async (req: Request, res: Response) => {
    const currentUser = await User.findById(req.currentUser?.id);
    if(!currentUser)
        throw new UnauthorizedError();
    
    const { subscriptionTier } = req.body;

    if(!subscriptionTier && subscriptionTier != SubscriptionTier.LowTier 
    && subscriptionTier != SubscriptionTier.MediumTier && subscriptionTier != SubscriptionTier.HighTier)
        throw new BadRequestError("Please provide a valid subscription Tier (DefaultTier,Low,Medium,High");

    //make sure that the user cant downgrade Tier
    //or hasnt selected the same subscription
    const currentTier = currentUser.UserTier;
    if(currentTier == subscriptionTier)
        throw new BadRequestError("You have already purchased the tier you selected");
    
    const currentTierValue = getTierValue(currentTier);
    const subscriptionTierValue = getTierValue(subscriptionTier);

    if(subscriptionTierValue < currentTierValue)
        throw new BadRequestError("You can only purchase tiers higher than current one");

    //create the stripe checkout session
    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            mode: "payment",
            success_url: `${req.protocol}://${req.get("host")}`,
            cancel_url: `${req.protocol}://${req.get("host")}`,
            client_reference_id: subscriptionTier,
            customer_email: currentUser.Email,
            line_items: [{
                    price_data: {
                    currency: "usd",
                    product_data: {
                        name: subscriptionTier
                    },
                    unit_amount: getTierPrice(subscriptionTier) * 100
                },
                quantity: 1
            }]
        });
        res.status(201).send({ checkout_url: session.url });
    } catch (err) {
        console.log(err);
        throw new Error("Stripe session could not be made");
    }
    

    res.status(200).send("halli");
})

router.post("/webhook", async (req, res) => {
    const signature = req.headers['stripe-signature'];
    if(!signature)
        throw new BadRequestError("Please provide stripe headers");
    let event = req.body;
    switch(event.type)
    {
        case 'payment_intent.succeeded':
            const user = await User.findOne({ Email: event.body.object.customer_email });
            if(!user)
                throw new BadRequestError("User does not longer exist");
            user.UserTier = event.body.object.display_items[0].name;
            try {
                await user.save();
            } catch (err) {
                throw new Error("Could not upgrade users tier");
            }
            break;
        default:
            throw new Error(`Event type of type: ${event.type} could not be handled`);
    }
})


export { router as SubscriptionRoutes }