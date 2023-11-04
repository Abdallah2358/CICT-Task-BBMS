db.BloodRequest.addHook('afterCreate', 'handleRequests', async (request, options) => {
    db.BloodRequest
      .findAll({
        where: { fulfilled: false },
        order: [['patient_state', 'ASC'], ['createdAt', 'ASC']]
      }).then((unfulfilledRequests) => {
        if (unfulfilledRequests.length >= 10) {
          db.Donation.findAll(
            {
              where: { in_stock: true }, order: [['createdAt', 'ASC']]
            }).then((donations) => {
              for (const req of unfulfilledRequests) {
                for (const donation of donations) {
                  if (req.blood_type_id === donation.blood_type_id) {
                    sequelize.transaction((t) => {
                      req.donation_id = donation.id;
                      req.fulfilled = true;
                      donation.in_stock = false;
                      req.save({ transaction: t })
                        .then(() => {
                          donation.save({ transaction: t })
                        });
                    });
                    break;
                  }
                }
              }
            });
        }
      })
  });