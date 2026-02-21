import { AcademicYear } from "../models/academicYear.models.js";
import { Class } from "../models/class.models.js";
import { Subject } from "../models/subject.models.js";
import { ApiError } from "../utils/ApiError.js";

class AdminService {
    // ---- Academic Year Management ----
    async createAcademicYear({ name, startDate, endDate }) {
        // Business logic: Check if academic year exists
        const exists = await AcademicYear.findOne({ name });
        if (exists) {
            throw new ApiError(400, "Academic year already exists");
        }

        const year = await AcademicYear.create({ name, startDate, endDate });
        return year;
    }

    async getAcademicYears() {
        return await AcademicYear.find().sort({ startDate: -1 });
    }

    async setActiveAcademicYear(id) {
        // Business logic: Deactivate all others first, then activate this one
        await AcademicYear.updateMany({}, { isActive: false });
        const year = await AcademicYear.findByIdAndUpdate(id, { isActive: true }, { new: true });
        if (!year) throw new ApiError(404, "Academic year not found");
        return year;
    }


    // ---- Class & Section Management ----
    async createClass({ name, sections, academicYearId }) {
        const year = await AcademicYear.findById(academicYearId);
        if (!year) throw new ApiError(404, "Academic year not found");

        const exists = await Class.findOne({ name, academicYear: academicYearId });
        if (exists) {
            throw new ApiError(400, "Class already exists in this academic year");
        }

        const newClass = await Class.create({
            name,
            sections,
            academicYear: academicYearId
        });
        return newClass;
    }

    async getClasses(academicYearId) {
        return await Class.find({ academicYear: academicYearId })
            .populate("sections.classTeacher", "fullname email")
            .populate("academicYear", "name");
    }


    // ---- Subject Management ----
    async createSubject({ name, code, academicYearId }) {
        const year = await AcademicYear.findById(academicYearId);
        if (!year) throw new ApiError(404, "Academic year not found");

        const exists = await Subject.findOne({ code, academicYear: academicYearId });
        if (exists) {
            throw new ApiError(400, "Subject with this code already exists");
        }

        const subject = await Subject.create({
            name,
            code,
            academicYear: academicYearId
        });
        return subject;
    }

    async getSubjects(academicYearId) {
        return await Subject.find({ academicYear: academicYearId })
            .populate("teachers", "fullname email");
    }
}

export const adminService = new AdminService();
