// const subscriptionModel = {
//     userId: 'userId',
//     isActive: true,
// };

// const getSubscription = async (userId) => { /* get an instance of the subscription model */ };

const subscriptionDao = require('../daos/subscription');

const requireActiveSubscription = async (req, res, next) => {
    // get the user's subscription
    //   - if isActive, call next()
    //   - else, return a 403
    const subscription = await subscriptionDao.getSubscription(req.userId);
    if (subscription.isActive) {
        next();
    } else {
        return res.sendStatus(403);
    }
};

// router.get('/notes', requireActiveSubscription, (req, res) => {
//     // routing logic
// });

// router.post('/notes', requireActiveSubscription, (req, res) => {
//     // routing logic
// });

router.use('/notes', requireAuthentication, requireActiveSubscription, noteRoutes);