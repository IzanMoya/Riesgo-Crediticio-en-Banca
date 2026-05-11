import io

SAMPLE_ROW = {
    "AMT_INCOME_TOTAL": 150_000.0,
    "AMT_CREDIT": 300_000.0,
    "AMT_ANNUITY": 25_000.0,
    "AMT_GOODS_PRICE": 270_000.0,
    "DAYS_BIRTH": -12_000,
    "DAYS_EMPLOYED": -2_000,
    "EXT_SOURCE_1": 0.5,
    "EXT_SOURCE_2": 0.5,
    "EXT_SOURCE_3": 0.5,
    "CODE_GENDER": "M",
    "FLAG_OWN_CAR": "Y",
    "FLAG_OWN_REALTY": "Y",
    "NAME_CONTRACT_TYPE": "Cash loans",
    "NAME_INCOME_TYPE": "Working",
    "NAME_EDUCATION_TYPE": "Higher education",
    "NAME_FAMILY_STATUS": "Married",
    "NAME_HOUSING_TYPE": "House / apartment",
    "OCCUPATION_TYPE": "Laborers",
    "ORGANIZATION_TYPE": "Business Entity Type 3",
}


def _make_csv(*rows: dict) -> bytes:
    if not rows:
        rows = (SAMPLE_ROW,)
    headers = list(rows[0].keys())
    lines = [",".join(headers)]
    for r in rows:
        lines.append(",".join(str(r[h]) for h in headers))
    return "\n".join(lines).encode()


def _post_csv(client, content: bytes, filename="test.csv"):
    return client.post(
        "/api/v1/predict/batch",
        files={"file": (filename, io.BytesIO(content), "text/csv")},
    )


def test_batch_single_row_returns_200(client):
    r = _post_csv(client, _make_csv())
    assert r.status_code == 200


def test_batch_response_structure(client):
    r = _post_csv(client, _make_csv())
    body = r.json()
    assert set(body.keys()) >= {"total", "aprobados", "denegados", "errores", "results"}


def test_batch_single_row_totals(client):
    r = _post_csv(client, _make_csv())
    body = r.json()
    assert body["total"] == 1
    assert body["aprobados"] + body["denegados"] + body["errores"] == 1


def test_batch_row_veredicto_valid(client):
    r = _post_csv(client, _make_csv())
    row = r.json()["results"][0]
    assert row["veredicto"] in ("APROBADO", "DENEGADO")
    assert row["error"] is None


def test_batch_multiple_rows(client):
    csv = _make_csv(SAMPLE_ROW, SAMPLE_ROW, SAMPLE_ROW)
    r = _post_csv(client, csv)
    body = r.json()
    assert body["total"] == 3
    assert len(body["results"]) == 3


def test_batch_row_numbers_sequential(client):
    csv = _make_csv(SAMPLE_ROW, SAMPLE_ROW)
    r = _post_csv(client, csv)
    rows = r.json()["results"]
    assert [row["row"] for row in rows] == [1, 2]


def test_batch_non_csv_extension_returns_400(client):
    r = client.post(
        "/api/v1/predict/batch",
        files={"file": ("data.xlsx", io.BytesIO(b"fake"), "application/octet-stream")},
    )
    assert r.status_code == 400


def test_batch_empty_csv_returns_400(client):
    r = _post_csv(client, b"")
    assert r.status_code == 400


def test_batch_invalid_row_produces_error_entry(client):
    bad_csv = b"AMT_INCOME_TOTAL,AMT_CREDIT\n150000,300000"
    r = _post_csv(client, bad_csv)
    body = r.json()
    assert body["errores"] >= 1
    error_row = next(row for row in body["results"] if row["error"])
    assert error_row["veredicto"] is None
