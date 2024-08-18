import { createAppointment } from './firestore';
import { createOrGetChat } from './chatService';

interface BookAppointmentParams {
  patientId: string;
  therapistId: string;
  therapistName: string;
  startTime: Date;
  userId: string;
}

export const bookAppointment = async ({
  patientId,
  therapistId,
  therapistName,
  startTime,
  userId
}: BookAppointmentParams): Promise<void> => {
  try {
    console.log('Booking appointment:', { patientId, therapistId, therapistName, startTime });
    
    const endTime = new Date(startTime);
    endTime.setHours(endTime.getHours() + 1);

    await createAppointment({
      patientId,
      therapistId,
      therapistName,
      startTime,
      endTime,
      status: 'scheduled'
    });

    console.log('Appointment created successfully');

    // Create or get chat
    console.log('Creating or getting chat');
    const chat = await createOrGetChat(userId, therapistId, therapistName);
    console.log('Chat created or retrieved:', chat);

  } catch (error) {
    console.error('Error in bookAppointment:', error);
    throw new Error('Failed to book appointment');
  }
};