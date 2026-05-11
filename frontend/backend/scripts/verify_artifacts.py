"""Verifica que todos los artefactos del pipeline esten presentes y sean cargables."""
import sys
import json
import joblib
from pathlib import Path

ARTIFACTS_ROOT = Path('D:/Proyectos/tfm_riesgoCrediticio/artifacts')

REQUIRED_PKL = [
    'model_lgbm_final.pkl',
    'scaler.pkl',
    'imputer.pkl',
    'median_values.pkl',
    'label_encoder_mappings.pkl',
    'categorical_columns_categories.pkl',
    'feature_columns_pre_selection.pkl',
    'selected_features.pkl',
    'dropped_isnan_flags.pkl',
]

errors = []

print(f'Directorio de artefactos: {ARTIFACTS_ROOT}')
print('-' * 60)

for fname in REQUIRED_PKL:
    fpath = ARTIFACTS_ROOT / fname
    if not fpath.exists():
        errors.append(f'FALTA: {fname}')
        print(f'  [FALTA]  {fname}')
        continue
    try:
        obj = joblib.load(fpath)
        length = len(obj) if hasattr(obj, '__len__') else 'N/A'
        print(f'  [OK]     {fname}  type={type(obj).__name__}  len={length}')
    except Exception as e:
        errors.append(f'ERROR cargando {fname}: {e}')
        print(f'  [ERROR]  {fname}: {e}')

# Verificar metadata.json
meta_path = ARTIFACTS_ROOT / 'metadata.json'
if not meta_path.exists():
    errors.append('FALTA: metadata.json')
    print('  [FALTA]  metadata.json')
else:
    try:
        meta = json.loads(meta_path.read_text(encoding='utf-8'))
        print(f'  [OK]     metadata.json  auc_val={meta.get("auc_val")}  '
              f'n_features_post={meta.get("n_features_post_selection")}')
    except Exception as e:
        errors.append(f'ERROR leyendo metadata.json: {e}')
        print(f'  [ERROR]  metadata.json: {e}')

# Validaciones de contenido
print('\n--- Validaciones de contenido ---')
try:
    selected = joblib.load(ARTIFACTS_ROOT / 'selected_features.pkl')
    if len(selected) != 22:
        errors.append(f'selected_features.pkl tiene {len(selected)} features, se esperaban 22')
        print(f'  [WARN]   selected_features.pkl: {len(selected)} features (esperadas 22)')
    else:
        print(f'  [OK]     selected_features.pkl: 22 features correctas')
        print(f'           Top 5: {selected[:5]}')
except Exception:
    pass

try:
    le = joblib.load(ARTIFACTS_ROOT / 'label_encoder_mappings.pkl')
    expected_keys = {'CODE_GENDER', 'FLAG_OWN_CAR', 'FLAG_OWN_REALTY', 'NAME_CONTRACT_TYPE'}
    missing = expected_keys - set(le.keys())
    if missing:
        errors.append(f'label_encoder_mappings le faltan claves: {missing}')
        print(f'  [WARN]   label_encoder_mappings.pkl: faltan claves {missing}')
    else:
        print(f'  [OK]     label_encoder_mappings.pkl: 4 encoders correctos')
except Exception:
    pass

try:
    meta = json.loads((ARTIFACTS_ROOT / 'metadata.json').read_text(encoding='utf-8'))
    assert meta['auc_val'] == 0.7563, f"auc_val incorrecto: {meta['auc_val']}"
    print(f'  [OK]     metadata.json: auc_val=0.7563 verificado')
except Exception as e:
    errors.append(f'Validacion metadata fallida: {e}')
    print(f'  [WARN]   metadata.json: {e}')

print('\n' + '=' * 60)
if errors:
    print(f'RESULTADO: {len(errors)} problema(s) encontrado(s):')
    for e in errors:
        print(f'  - {e}')
    sys.exit(1)
else:
    print('RESULTADO: Todos los artefactos OK. El backend puede arrancar.')
    sys.exit(0)
