import { ExclamationTriangleIcon } from '@heroicons/react/20/solid'

function Alert() {
    return (
        <div className="rounded-md text-sm dark:bg-gray-800 p-4 mt-8 mb-8">
            <div className="flex">
                <div className="flex-shrink-0">
                    <ExclamationTriangleIcon className="h-5 w-5 text-yellow-400" aria-hidden="true" />
                </div>
                <div className="ml-3">
                    <h3 className="text-sm font-medium text-yellow-400">Attention needed</h3>
                    <div className="mt-2 text-sm text-yellow-400">
                        <p>
                            Answers are provided by a large language model and sometimes can be completely wrong.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
};

export default Alert;