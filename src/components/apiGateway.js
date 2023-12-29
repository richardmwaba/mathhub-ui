export function getData(url, callback, errorCallback, loadingCallback) {
    loadingCallback(true);
    fetch(url)
        .then((response) => {
            if (!response.ok) {
                throw new Error('Something went wrong while fetching this data. Please try again.');
            }
            return response.json();
        })
        .then((result) => {
            errorCallback('');
            callback(result);
        })
        .catch((err) => {
            errorCallback(err.message);
        })
        .finally(() => {
            loadingCallback(false);
        });
}
