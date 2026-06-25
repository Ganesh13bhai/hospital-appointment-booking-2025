const db = require('../database/connection');

exports.stats = (req, res) => {

    const data = {};

    db.get(
        "SELECT COUNT(*) total FROM appointments",
        [],
        (err, row) => {

            if (err) {
                return res.status(500).json({
                    error: err.message
                });
            }

            data.total = row.total;

            db.get(
                "SELECT COUNT(*) pending FROM appointments WHERE status='Pending'",
                [],
                (err, row) => {

                    data.pending = row.pending;

                    db.get(
                        "SELECT COUNT(*) completed FROM appointments WHERE status='Completed'",
                        [],
                        (err, row) => {

                            data.completed = row.completed;

                            db.get(
                                "SELECT COUNT(*) cancelled FROM appointments WHERE status='Cancelled'",
                                [],
                                (err, row) => {

                                    data.cancelled = row.cancelled;

                                    res.json(data);

                                }
                            );

                        }
                    );

                }
            );

        }
    );

};