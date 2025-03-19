const express = require('express');
const router = express.Router();
const {
  updateProfile,
  addVehicle,
  getVehicles,
  findNearbyGarages,
  addPreferredGarage,
  submitReview
} = require('../controllers/customerController');
const { protect, authorize } = require('../middleware/auth');

/**
 * @swagger
 * tags:
 *   name: Customers
 *   description: Customer management and operations
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Vehicle:
 *       type: object
 *       properties:
 *         make:
 *           type: string
 *           description: Vehicle manufacturer
 *         model:
 *           type: string
 *           description: Vehicle model
 *         year:
 *           type: integer
 *           description: Manufacturing year
 *         licensePlate:
 *           type: string
 *           description: License plate number
 *         vin:
 *           type: string
 *           description: Vehicle identification number
 *     Review:
 *       type: object
 *       properties:
 *         rating:
 *           type: number
 *           minimum: 1
 *           maximum: 5
 *           description: Rating between 1-5
 *         comment:
 *           type: string
 *           description: Review comment
 *     Garage:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         garageName:
 *           type: string
 *         address:
 *           type: object
 *         services:
 *           type: array
 *         ratings:
 *           type: object
 */

// Apply middleware to all routes
router.use(protect);
router.use(authorize('customer'));

/**
 * @swagger
 * /api/customers/profile:
 *   put:
 *     summary: Update customer profile
 *     tags: [Customers]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               phone:
 *                 type: string
 *               address:
 *                 type: object
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *       401:
 *         description: Not authorized
 *       404:
 *         description: Customer not found
 */
router.put('/profile', updateProfile);

/**
 * @swagger
 * /api/customers/vehicles:
 *   post:
 *     summary: Add a vehicle to customer profile
 *     tags: [Customers]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Vehicle'
 *     responses:
 *       201:
 *         description: Vehicle added successfully
 *       401:
 *         description: Not authorized
 *       404:
 *         description: Customer not found
 *   get:
 *     summary: Get all customer vehicles
 *     tags: [Customers]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of vehicles
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 count:
 *                   type: integer
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Vehicle'
 *       401:
 *         description: Not authorized
 *       404:
 *         description: Customer not found
 */
router.post('/vehicles', addVehicle);
router.get('/vehicles', getVehicles);

/**
 * @swagger
 * /api/customers/garages/nearby:
 *   get:
 *     summary: Find nearby garages
 *     tags: [Customers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: latitude
 *         schema:
 *           type: number
 *         required: true
 *         description: Latitude coordinate
 *       - in: query
 *         name: longitude
 *         schema:
 *           type: number
 *         required: true
 *         description: Longitude coordinate
 *       - in: query
 *         name: maxDistance
 *         schema:
 *           type: integer
 *         description: Maximum distance in meters (default 10000)
 *     responses:
 *       200:
 *         description: List of nearby garages
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 count:
 *                   type: integer
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Garage'
 *       400:
 *         description: Missing coordinates
 *       401:
 *         description: Not authorized
 */
router.get('/garages/nearby', findNearbyGarages);

/**
 * @swagger
 * /api/customers/preferred-garages/{garageId}:
 *   post:
 *     summary: Add a garage to customer's preferred list
 *     tags: [Customers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: garageId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the garage to add
 *     responses:
 *       200:
 *         description: Garage added to preferred list
 *       400:
 *         description: Garage already in preferred list
 *       401:
 *         description: Not authorized
 *       404:
 *         description: Garage not found
 */
router.post('/preferred-garages/:garageId', addPreferredGarage);

/**
 * @swagger
 * /api/customers/reviews/{garageId}:
 *   post:
 *     summary: Submit a review for a garage
 *     tags: [Customers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: garageId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the garage to review
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Review'
 *     responses:
 *       201:
 *         description: Review submitted successfully
 *       400:
 *         description: Invalid rating or already reviewed
 *       401:
 *         description: Not authorized
 *       404:
 *         description: Garage not found
 */
router.post('/reviews/:garageId', submitReview);

module.exports = router;