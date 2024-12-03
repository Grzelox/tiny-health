import { format } from 'date-fns';
import { RatIcon, Calendar, Stethoscope, Pill } from 'lucide-react';

const mockPetDetails = {
  id: 1,
  name: 'Whiskers',
  breed: 'Fancy Mouse',
  birthDate: '2023-06-15',
  weight: '28g',
  visits: [
    {
      date: '2024-02-15',
      type: 'Regular Checkup',
      notes: 'All vitals normal, weight stable',
      medications: ['Vitamin supplement']
    },
    {
      date: '2024-01-15',
      type: 'Vaccination',
      notes: 'Annual vaccination completed',
      medications: []
    }
  ]
};

const PetDetails = ({ id }: { id: string }) => {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
        <div className="flex items-center space-x-4 mb-6">
          <RatIcon className="w-12 h-12 text-primary-600" />
          <div>
            <h1 className="text-3xl font-bold text-primary-800">{mockPetDetails.name}</h1>
            <p className="text-secondary-600">{mockPetDetails.breed}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-primary-50 p-4 rounded-lg">
            <Calendar className="w-6 h-6 text-primary-600 mb-2" />
            <p className="text-sm text-secondary-600">Birth Date</p>
            <p className="font-medium">{format(new Date(mockPetDetails.birthDate), 'MMM d, yyyy')}</p>
          </div>
          <div className="bg-primary-50 p-4 rounded-lg">
            <Stethoscope className="w-6 h-6 text-primary-600 mb-2" />
            <p className="text-sm text-secondary-600">Current Weight</p>
            <p className="font-medium">{mockPetDetails.weight}</p>
          </div>
          <div className="bg-primary-50 p-4 rounded-lg">
            <Pill className="w-6 h-6 text-primary-600 mb-2" />
            <p className="text-sm text-secondary-600">Active Medications</p>
            <p className="font-medium">1 medication</p>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-primary-800 mb-4">Medical History</h2>
          <div className="space-y-4">
            {mockPetDetails.visits.map((visit, index) => (
              <div key={index} className="border-l-4 border-primary-400 pl-4 py-2">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-primary-700">{visit.type}</p>
                    <p className="text-sm text-secondary-600">
                      {format(new Date(visit.date), 'MMM d, yyyy')}
                    </p>
                  </div>
                </div>
                <p className="text-secondary-700 mt-2">{visit.notes}</p>
                {visit.medications.length > 0 && (
                  <div className="mt-2">
                    <p className="text-sm font-medium text-primary-600">Medications:</p>
                    <ul className="list-disc list-inside text-sm text-secondary-600">
                      {visit.medications.map((med, idx) => (
                        <li key={idx}>{med}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PetDetails;