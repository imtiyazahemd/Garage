const express = require('express');
const router = express.Router();
const {
  updateProfile,
  addService,
  getServices,
  updateHours,
  updateSpecialties,
  getReviews
} = require('../controllers/garageController');
const { protect, authorize } = require('../middleware/auth');

/**
 * @swagger
 * tags:
 *   name: Garages
 *   description: Garage management and operations
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Service:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: Service name
 *         description:
 *           type: string
 *           description: Service description
 *         estimatedTime:
 *           type: string
 *           description: Estimated time to complete the service
 *         basePrice:
 *           type: number
 *           description: Base price for the service
 *     OperatingHours:
 *       type: object
 *       properties:
 *         monday:
 *           type: object
 *           properties:
 *             open:
 *               type: string
 *               example: "09:00"
 *             close:
 *               type: string
 *               example: "18:00"
 *             isOpen:
 *               type: boolean
 *         tuesday:
 *           type: object
 *           properties:
 *             open:
 *               type: string
 *             close:
 *               type: string
 *             isOpen:
 *               type: boolean
 *         wednesday:
 *           type: object
 *           properties:
 *             open:
 *               type: string
 *             close:
 *               type: string
 *             isOpen:
 *               type: boolean
 *         thursday:
 *           type: object
 *           properties:
 *             open:
 *               type: string
 *             close:
 *               type: string
 *             isOpen:
 *               type: boolean
 *         friday:
 *           type: object
 *           properties:
 *             open:
 *               type: string
 *             close:
 *               type: string
 *             isOpen:
 *               type: boolean
 *         saturday:
 *           type: object
 *           properties:
 *             open:
 *               type: string
 *             close:
 *               type: string
 *             isOpen:
 *               type: boolean
 *         sunday:
 *           type: object
 *           properties:
 *             open:
 *               type: string
 *             close:
 *               type: string
 *             isOpen:
 *               type: boolean
 */

// Apply middleware to all routes
router.use(protect);
router.use(authorize('garage'));

/**
 * @swagger
 * /api/garages/profile:
 *   put:
 *     summary: Update garage profile
 *     tags: [Garages]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               garageName:
 *                 type: string
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               phone:
 *                 type: string
 *               address:
 *                 type: object
 *               latitude:
 *                 type: number
 *               longitude:
 *                 type: number
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *       401:
 *         description: Not authorized
 *       404:
 *         description: Garage not found
 */
router.put('/profile', updateProfile);

/**
 * @swagger
 * /api/garages/services:
 *   post:
 *     summary: Add a service to garage
 *     tags: [Garages]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Service'
 *     responses:
 *       201:
 *         description: Service added successfully
 *       401:
 *         description: Not authorized
 *       404:
 *         description: Garage not found
 *   get:
 *     summary: Get all garage services
 *     tags: [Garages]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of services
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
 *                     $ref: '#/components/schemas/Service'
 *       401:
 *         description: Not authorized
 *       404:
 *         description: Garage not found
 */
router.post('/services', addService);
router.get('/services', getServices);

/**
 * @swagger
 * /api/garages/hours:
 *   put:
 *     summary: Update garage's business hours
 *     tags: [Garages]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/OperatingHours'
 *     responses:
 *       200:
 *         description: Operating hours updated successfully
 *       401:
 *         description: Not authorized
 *       404:
 *         description: Garage not found
 */
router.put('/hours', updateHours);

/**
 * @swagger
 * /api/garages/specialties:
 *   put:
 *     summary: Update garage specialties
 *     tags: [Garages]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               specialties:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Specialties updated successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Not authorized
 *       404:
 *         description: Garage not found
 */
router.put('/specialties', updateSpecialties);

/**
 * @swagger
 * /api/garages/reviews:
 *   get:
 *     summary: Get garage reviews
 *     tags: [Garages]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of reviews
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 count:
 *                   type: integer
 *                 ratings:
 *                   type: object
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *       401:
 *         description: Not authorized
 *       404:
 *         description: Garage not found
 */
router.get('/reviews', getReviews);

module.exports = router;